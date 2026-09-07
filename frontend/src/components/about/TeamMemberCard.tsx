import type { TeamMember } from '../../data/about'
import { unsplashSrcSet } from '../../data/images'

type TeamMemberCardProps = {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="card-comic overflow-hidden rounded-card">
      <div className="aspect-square overflow-hidden border-b-2 border-ink-dark">
        <img
          src={member.photo}
          srcSet={unsplashSrcSet(member.photo)}
          sizes="(min-width: 768px) 22rem, 92vw"
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="font-sans text-lg font-bold text-ink-dark">
          {member.name}
        </h3>
        <p className="mt-0.5 font-sans text-sm font-semibold text-accent-red">
          {member.title}
        </p>
      </div>
    </div>
  )
}
