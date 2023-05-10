import { signOut, useSession } from "next-auth/react"
import { useState } from "react";
import styles from '@/styles/Navbar.module.css'
import Link from "next/link";

export default function Navbar({ setSearchQuery }: { setSearchQuery: Function | undefined }) {
    const { data: session } = useSession();

    const [showNavbarResponsive, setShowNavbarResponsive] = useState<boolean>(false)

    const toggleHamburguer = () => {
        setShowNavbarResponsive(prev => !prev)
    }

    return (
        <nav id='navbar' className={`${styles["navbar"]} ${styles["navbar-expand-lg"]}`}>
            <div className={`${styles["container-fluid"]}`}>
                <Link href="/" className={styles["navbar-brand"]}>Give Your Time</Link>
                <Link href="/auth/login" className={styles["nav-link"]}>Contacte</Link>
                <Link href="/auth/login" className={styles["nav-link"]}></Link>

                <button type="button" className={styles["navbar-toggler"]} onClick={toggleHamburguer}>
                    <span className={styles["navbar-toggler-icon"]}></span>
                </button>
                <div className={`${styles['collapse']} ${styles['navbar-collapse']} ${showNavbarResponsive && styles['show']}`} id="navbarCollapse">
                    <div className={`${styles['navbar-nav']} ${styles['ms-auto']}`}>

                        {setSearchQuery && (
                            <input className={styles["nav-input"]} onChange={(e) => setSearchQuery(e.target.value)}></input>
                        )}
                        {session ? (
                            <>
                                <Link href="/ineedhelp" className={styles["nav-link"]}>Publicar</Link>
                                <Link href="/profile" className={styles["nav-link"]}>Perfil</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register" className={styles["nav-link"]}>Registrar-me</Link>
                                <Link href="/auth/login" className={styles["nav-link"]}>Iniciar sessió</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    )
}