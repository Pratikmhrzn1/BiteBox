import SectionHeading from '../../components/common/SectionHeading'
import TeamMemberCard from '../../components/about/TeamMemberCard'
import type { TeamMember } from '../../data/about'

type MeetTheTeamProps = {
  members: TeamMember[]
}

export default function MeetTheTeam({ members }: MeetTheTeamProps) {
  return (
    <section className="mt-14">
      <SectionHeading>Meet the Team</SectionHeading>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}
