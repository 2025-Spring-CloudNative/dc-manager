import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./LoginPage.module.scss"
import { useLoginMutation } from "@features/user/hooks/useUser"

export default function LoginPage() {
    const loginMutation = useLoginMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState({ email: "", password: "" })

    const { isError, error } = loginMutation
    const from = location.state?.from?.pathname || "/"

    const handleChange = (e: any) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e: any) => {
        e.preventDefault()
        loginMutation.mutate(form, {
            onSuccess: () => navigate(from, { replace: true }),
        })
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Data Center Management System</h1>

                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={!form.email || !form.password}
                >
                    登入
                </button>

                {/* simple inline error; swap for toast/snackbar if you prefer */}
                {isError && (
                    <p className={styles.error}>
                        {/* backend should send { message } — fall back if not */}
                        {error instanceof Error
                            ? error.message
                            : "Login failed"}
                    </p>
                )}
            </form>
        </div>
    )
}
