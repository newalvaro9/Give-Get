import { signOut, useSession } from "next-auth/react"
import { useState } from "react";
import styles from '@/styles/Navbar.module.css'
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ setSearchQuery }: { setSearchQuery: Function | undefined }) {
    const { data: session } = useSession();

    const [showNavbarResponsive, setShowNavbarResponsive] = useState<boolean>(false)

    const toggleHamburguer = () => {
        setShowNavbarResponsive(prev => !prev)
    }


    return (
        <nav id='navbar' className={`${styles["navbar"]} ${styles["navbar-expand-lg"]}`}>
            <div className={`${styles["container-fluid"]}`}>
                <Link href="/posts" className={styles["navbar-brand"]}>
                    <Image
                        src={"/logotipo.png"}
                        alt={'Give & Get'}
                        quality={100}
                        width={138}
                        height={38}
                    />
                </Link>

                <button type="button" className={styles["navbar-toggler"]} onClick={toggleHamburguer}>
                    <span className={styles["navbar-toggler-icon"]}></span>
                </button>
                <div className={`${styles['collapse']} ${styles['navbar-collapse']} ${showNavbarResponsive && styles['show']}`} id="navbarCollapse">
                    <div className={`${styles['navbar-nav']} ${styles['ms-auto']}`}>

                        {setSearchQuery && (
                            <div className={styles["search"]}>
                                <input className={styles["search-txt"]} type="text" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." onMouseOut={(e) => { e.currentTarget.blur(); }}></input>

                                <a className={styles["search-btn"]}>
                                    <Image
                                        src={"/magnifying.svg"}
                                        className="img"
                                        width={20}
                                        height={20}
                                        alt={'Search'}
                                        style={{ alignSelf: 'center', cursor: 'pointer' }}
                                    />
                                </a>
                            </div>

                        )}

                        <a href="/" className={styles["nav-link"]}>Inici</a>
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