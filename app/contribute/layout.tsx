import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Contribute to Sutra – suggest a topic, pitch a guest post, or propose a collaboration. Reach out to Rohan Yashraj Gupta.",
  openGraph: {
    title: "Contribute to Sutra",
    description:
      "Have an idea for a post or want to collaborate? Reach out to contribute to Sutra.",
    url: "https://sutra.aiactuaries.org/contribute",
  },
  alternates: {
    canonical: "https://sutra.aiactuaries.org/contribute",
  },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
