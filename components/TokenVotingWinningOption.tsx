interface TokenVotingProposalStatus {
  yes: string;
  no: string;
  abstain: string;
}
const calculateTokenVotingProposalStatus = (prop: TokenVotingProposalStatus) => {
  let totalUsedVotingPower = BigInt(prop.yes) + BigInt(prop.no) + BigInt(prop.abstain)

  let winningProposal = { label: 'Yay', value: BigInt(prop.yes), percentage: `0` }
  if (prop.yes > prop.no && prop.abstain) {
    winningProposal = { label: "Yay", value: BigInt(prop.yes) / BigInt(10 ** 18), percentage: `${BigInt(prop.yes) * BigInt(100) / totalUsedVotingPower}` }
  } else if (prop.no > prop.abstain) {
    winningProposal = { label: "Nay", value: BigInt(prop.no), percentage: `${BigInt(prop.no) * BigInt(100) / totalUsedVotingPower}` }
  } else {
    winningProposal = { label: "Abstain", value: BigInt(prop.abstain), percentage: `${BigInt(prop.abstain) * BigInt(100) / totalUsedVotingPower}` }
  }

  return winningProposal;
}

const TokenVotingWinningOption: React.FC<any> = ({ proposal }) => {
  let winningProposal = calculateTokenVotingProposalStatus(proposal);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      border: '1px',
      borderColor: '#E4E7EB',
      borderRadius: '8px',
      marginTop: 2,
      padding: 5,
      paddingLeft: 15,
      paddingRight: 15,
      boxShadow: '0px 1px 2px 0px rgba(97, 110, 124, 0.05)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <p style={{ color: '#323F4B', fontSize: '1.25rem', margin: '0.2em' }}>
          Winning Option
        </p>
        <p style={{ color: '#616E7C', fontSize: '1.25rem', margin: '0.2em' }}>
          {winningProposal.percentage}%
        </p>
      </div>

      <div style={{
        display: 'flex',
        backgroundColor: '#E4E7EB',
        borderRadius: 12,
        width: `100%`,
        whiteSpace: 'nowrap',
        overflow: 'visible',
      }}>
        <div style={{
          backgroundColor: '#007bff',
          padding: 10,
          borderRadius: 12,
          width: `${winningProposal.percentage}%`,
          whiteSpace: 'nowrap',
          overflow: 'visible',
        }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <p style={{ color: '#3164FA', fontSize: '1.3rem', margin: '0.2em' }}>
          {winningProposal.label}
        </p>
        <p style={{ color: '#616E7C', fontSize: '1.3rem', margin: '0.2em' }}>
          {winningProposal.value.toString()} wANT
        </p>
      </div>
    </div>
  )
};

export default TokenVotingWinningOption;
