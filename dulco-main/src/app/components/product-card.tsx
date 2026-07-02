"use client";
import Image from "next/image";
import { useState } from "react";
import { useCarrinho } from "./carrinhocontext";

export type ProductCardProps = {
  id: number;
  productName: string;
  price: number;
  imageUrl: string;
};

export default function ProductCard({ id, productName, price, imageUrl }: ProductCardProps) {
  const { adicionarItem } = useCarrinho();
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    adicionarItem({
      id,
      nome: productName,
      preco: price,
      quantidade: quantity,
    });
    setQuantity(1)
  };

  const formattedPrice = price.toFixed(2).replace(".", ",");

  return (
    <div className="bg-[#DFD1DE] w-[50vh] h-[50vh] rounded-4xl p-3 pb-[20px] flex flex-col mt-18">
      <Image
        src={imageUrl}
        alt={productName}
        width={200}
        height={200}
        className="object-cover w-full h-[75%] rounded-t-2xl rounded-b-xl hover:rounded-4xl hover:scale-105 duration-300"
      />
      <div className="text-[2.5vh] text-[#633F6E] my-1">
        <h2>{productName}</h2>
        <h3>R${formattedPrice}</h3>
      </div>

      <div className="flex text-[#8F8282] font-bold justify-between mt-auto">
        <div className="bg-[#F6F6F6] w-[35%] p-1 flex text-[2vh] justify-between items-center rounded-full ">
          <button onClick={decrement}>
            <Image
              src={"/icons/minus-icon.svg"}
              alt="Diminuir quantidade"
              width={20}
              height={20}
              className="w-[3vh] h-[3vh] hover:cursor-pointer"
            />
          </button>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={handleQuantityChange}
            className="bg-transparent w-[5vh] text-center outline-none appearance-none no-spinner"
          />

          <button onClick={increment}>
            <Image
              src={"/icons/plus-icon.svg"}
              alt="Aumentar quantidade"
              width={20}
              height={20}
              className="w-[3vh] h-[3vh] hover:cursor-pointer"
            />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-[#F6F6F6] p-1 px-3 flex justify-around items-center rounded-full hover:cursor-pointer text-[2vh]"
        >
          Adicionar
          <Image
            src={"/icons/bag-icon.svg"}
            alt="Adicionar ao carrinho"
            width={20}
            height={20}
            className="w-[3vh] h-[3vh] ml-3"
          />
        </button>
      </div>
    </div>
  );
}