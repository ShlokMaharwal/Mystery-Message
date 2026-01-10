import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SAFE_COMPLIMENTS = [
  "You bring a positive energy to conversations.",
  "You explain things in a really clear and thoughtful way.",
  "People feel comfortable talking to you.",
  "You have a great sense of balance and calm.",
  "You make discussions more enjoyable.",
  "You seem like someone who listens carefully.",
  "You have a good way of expressing ideas.",
  "Your perspective is refreshing.",
  "You add value to conversations without trying too hard.",
  "You come across as kind and respectful.",
  "You make things easier to understand.",
  "You communicate in a very genuine way.",
  "You seem dependable and thoughtful.",
  "Your words have a calming effect.",
  "You bring clarity when things feel confusing."
];

function getRandomItems(arr: string[], count: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const count =
      typeof body?.count === "number" && body.count > 0 && body.count <= 5
        ? body.count
        : 3;

    const compliments = getRandomItems(SAFE_COMPLIMENTS, count);

    return NextResponse.json(
      {
        success: true,
        compliments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("suggested-messages error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
