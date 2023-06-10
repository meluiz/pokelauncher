import { useAuthStore } from '../../../../../stores'
import Card from './elements/card'

const Cards = function () {
  const { user, accounts } = useAuthStore()

  if (!user || !accounts) {
    return (
      <li role="listitem">
        <Card name="Alien" uuid="abcdefgh-ijkl-mnop-qrst-uvwxyz" />
      </li>
    )
  }

  return accounts.map((data) => (
    <li key={data.uuid} role="listitem">
      <Card {...data} />
    </li>
  ))
}

export default Cards
