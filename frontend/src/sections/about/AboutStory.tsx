import SectionHeading from '../../components/common/SectionHeading'

type AboutStoryProps = {
  storyCopy: string
  storyImage: string
}

export default function AboutStory({ storyCopy, storyImage }: AboutStoryProps) {
  return (
    <section className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <SectionHeading>Our Story</SectionHeading>
        <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-ink-dark">
          {storyCopy}
        </p>
      </div>
      <div className="overflow-hidden rounded-card border-2 border-ink-dark shadow-comic-md">
        <img
          src={storyImage}
          alt="Inside the BiteBox kitchen"
          loading="lazy"
          className="aspect-[4/3] h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
