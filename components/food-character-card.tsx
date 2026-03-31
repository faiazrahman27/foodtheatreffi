import Image from "next/image";

interface FoodCharacterCardProps {
  name: string;
  role: string;
  tags: string[];
  description: string;
  image: string;
}

export function FoodCharacterCard({
  name,
  role,
  tags,
  description,
  image,
}: FoodCharacterCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-black/45">
          {role}
        </p>

        <h3 className="mt-3 text-2xl font-semibold">{name}</h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 leading-7 text-black/65">{description}</p>

        <button className="mt-6 text-sm font-medium text-black/80 transition hover:text-black">
          View Profile →
        </button>
      </div>
    </article>
  );
}