import Image from "next/image";
import { useEffect, useState } from "react";

export default function AboutTheDeveloper() {
  const [imageWidth, setImageWidth] = useState(120);
  const [imageHeight, setImageHeight] = useState(168);

  // Adjust the image size based on the viewport width
  useEffect(() => {
    const updateImageSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setImageWidth(120);
        setImageHeight(168);
      } else if (width < 768) {
        setImageWidth(160);
        setImageHeight(224);
      } else {
        setImageWidth(200);
        setImageHeight(280);
      }
    };

    updateImageSize();
    window.addEventListener("resize", updateImageSize);

    return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  return (
    <div className="bg-[var(--darkgrey)] text-[var(--dmono)] rounded-2xl shadow-lg border-2 border-[var(--greyRing)] min-w-[250px]  p-2 md:p-6">
      <div>
        <Image
          src="/developer.jpg"
          alt="Developer's profile picture"
          width={imageWidth}
          height={imageHeight}
          className="float-right ml-8 mb-2 object-contain shadow-lg"
          style={{
            borderRadius: "50% / 55%" /* Smoother, more natural oval */,
            shapeOutside: "ellipse(50% 55%)",
            width: imageWidth,
            height: imageHeight,
            background:
              "var(--darkgrey)" /* Optional: subtle bg for non-rectangular images */,
          }}
        />
        <h2 className="text-xl font-bold text-[var(--primary)] mb-4 text-left">
          About the Developer
        </h2>
        <p className="text-[var(--aWhite)] mb-6 text-left whitespace-pre-line leading-relaxed">
          Hi there! My name is <b>Damon Thomas</b>, and I&apos;m an enthusiastic{" "}
          <b>Full-Stack Web Developer</b> driven to create intuitive and
          impactful applications. I build responsive and dynamic web
          experiences, leveraging modern frontend technologies like <b>React</b>{" "}
          and <b>Next.js</b> with <b>Tailwind CSS</b> for clean, user-centric
          design. For the backend, I utilize <b>Node.js</b>, <b>Express</b>, and{" "}
          <b>PostgreSQL</b> to develop robust and scalable solutions, with a
          primary focus on crafting effective{" "}
          <b>websites and web-based tools</b>.
          <br />
          <br />
          I&apos;m currently open to new opportunities and collaborations. If
          you have a project in mind or just want to connect, please don&apos;t
          hesitate to reach out via the contact form below or connect with me at
          the following links.
        </p>
        <div className="flex flex-row gap-4 mt-4">
          <Image
            src="/linkedIn.svg"
            alt="LinkedIn"
            width={28}
            height={28}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              window.open(
                "https://www.linkedin.com/in/damon-thomas-445a39126/",
                "_blank"
              );
            }}
          />
          <Image
            src="/github-mark-white.svg"
            alt="GitHub"
            width={28}
            height={28}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              window.open("https://github.com/Damon-Thomas", "_blank");
            }}
          />
        </div>
      </div>
    </div>
  );
}
