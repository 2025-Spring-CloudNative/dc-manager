import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./LoginPage.module.scss"
import { useLoginMutation } from "@features/user/hooks/useUser"

export default function LoginPage() {
    const loginMutation = useLoginMutation()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })

    const { isError, error } = loginMutation

    const handleChange = (e: any) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e: any) => {
        e.preventDefault()
        // TODO: replace with real auth call
        // console.log("Logging in with:", form)
        loginMutation.mutate(form, {
            onSuccess: () => navigate("/"),
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
                    Log in
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
