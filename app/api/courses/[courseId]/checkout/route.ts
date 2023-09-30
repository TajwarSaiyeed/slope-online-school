import Stripe from "stripe";
import {auth, currentUser} from "@clerk/nextjs";
import {NextResponse} from "next/server";

import {db} from "@/lib/db";
import {stripe} from "@/lib/stripe";

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const sessionId = searchParams.get("sessionId") as string;

        const {userId} = auth()

        if (!userId) {
            return new NextResponse("Unauthorized",
                {status: 401}
            );
        }

        if (!sessionId) {
            return NextResponse.json(
                {error: "Missing session id"},
                {status: 400}
            );
        }

        if (!sessionId.startsWith("cs_")) {
            throw new Error("Invalid session id");
        }

        const checkoutSession = (await stripe.checkout.sessions.retrieve(
            sessionId,
            {
                expand: ["payment_intent", 'line_items'],
            }
        )) as Stripe.Checkout.Session;

        if (checkoutSession.payment_status === 'paid') {
            const purchase = await db.purchase.findUnique({
                where: {
                    userId_courseId: {
                        courseId: checkoutSession?.metadata?.courseId!,
                        userId: checkoutSession?.metadata?.userId!,
                    }
                }
            })

            if (!purchase) {
                await db.purchase.create({
                    data: {
                        courseId: checkoutSession?.metadata?.courseId!,
                        userId: checkoutSession?.metadata?.userId!,
                    }
                })
                return NextResponse.json(null, {status: 200})
            }
            return NextResponse.json(null, {status: 200})
        }
    } catch (error) {
        console.log('PURCHASE_GET', error)
    }
}

export async function POST(
    req: Request,
    {params}: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        });

        if (purchase) {
            return new NextResponse("Already purchased", {status: 400});
        }

        if (!course) {
            return new NextResponse("Not found", {status: 404});
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&courseId=${course.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=true`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            }
        });

        return NextResponse.json({url: session.url});
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}