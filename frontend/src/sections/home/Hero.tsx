import { heroBurgerImg } from '../../assets'

type HeroProps = {
  copy: { accent: string; cta: string }
}

export default function Hero({ copy }: HeroProps) {
  return (
    <section className="relative flex min-h-[26rem] items-stretch overflow-hidden rounded-3xl text-white shadow-xl">
      <img
        src={heroBurgerImg}
        alt="A delicious BiteBox burger"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-espresso-dark via-espresso-dark/70 to-espresso-dark/20" />

      <div className="relative z-10 flex w-full flex-col justify-center gap-1 p-8 sm:p-10 lg:w-[55%] lg:p-12">
        <h1 className="font-titan text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
          EAT
          <br />
          <span className="font-script text-7xl font-bold text-yellow-300 sm:text-8xl">
            {copy.accent}
          </span>
          <br />
          REPEAT
        </h1>
        <button
          type="button"
          className="mt-8 w-fit rounded-full bg-accent-red px-6 py-2.5 font-sans text-sm font-bold tracking-widest text-white uppercase shadow-lg transition hover:bg-red-700"
        >
          {copy.cta}
        </button>
      </div>
    </section>
  )
}