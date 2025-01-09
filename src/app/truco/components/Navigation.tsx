import Link from 'next/link'
import styles from './navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Link href="/truco">Placar</Link>
      <Link href="/truco/history">Histórico</Link>
    </nav>
  )
} 