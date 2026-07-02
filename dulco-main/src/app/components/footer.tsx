import Link from "next/link";
import Image from "next/image";

// contact example: 558199887744
type FooterProps = {
  contactNumber?: string;
};

export default function Footer(props: FooterProps) {
  return (
    <footer className="bg-[#633F6E] text-white py-5 text-center mt-auto">
      <h1 className="font-bold text-[3.5vh]">Dulço</h1>
      <p className="text-gray-200">
        Transformando ingredientes em momentos de felicidade.
      </p>

      <h2 className="font-bold text-[2vh] my-4 mb-2">Entre em Contato</h2>
      <p className="text-gray-200">Caruaru-PE</p>
      <div className="flex justify-center gap-4 my-4">
        <Link href={"https://www.instagram.com/doce.dulcor/"} target="_blank">
          <Image
            src={"icons/instagram-icon.svg"}
            width={25}
            height={25}
            alt="Instagram Icon"
          ></Image>
        </Link>
        <Link href={`https://wa.me/${props.contactNumber}`} target="_blank">
          <Image
            src={"icons/whatsapp-icon.svg"}
            width={25}
            height={25}
            alt="Whatsapp Icon"
          ></Image>
        </Link>
      </div>
    </footer>
  );
}
