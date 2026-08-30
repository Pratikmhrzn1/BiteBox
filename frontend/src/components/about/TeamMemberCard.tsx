import type { TeamMember } from '../../data/about'

type TeamMemberCardProps = {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="card-comic overflow-hidden rounded-2xl">
      <div className="aspect-square overflow-hidden border-b-2 border-ink-dark">
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
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
