import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfoMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Введите корректный адрес электронной почты.')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов.')
      return
    }

    setSubmitting(true)

    try {
      if (isRegister) {
        const { error: signUpError, user } = await signUp(trimmedEmail, password)
        if (signUpError) {
          setError(signUpError.message)
        } else if (user && !user.confirmed_at && user.identities?.length === 0) {
          setInfoMessage('Пользователь уже зарегистрирован. Переключитесь на вкладку «Вход».')
        } else {
          setInfoMessage('Регистрация успешна! Если подтверждение email отключено, выполняется вход.')
          navigate('/movies')
        }
      } else {
        const { error: signInError } = await signIn(trimmedEmail, password)
        if (signInError) {
          setError(
            signInError.message === 'Invalid login credentials'
              ? 'Неверный адрес email или пароль.'
              : signInError.message,
          )
        } else {
          navigate('/movies')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при авторизации.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="form-container auth-container">
        <header className="form-header">
          <h1>{isRegister ? 'Регистрация аккаунта' : 'Вход в медиатеку'}</h1>
          <p className="page-description">
            {isRegister
              ? 'Создайте личный профиль для сохранения фильмов в облачную базу данных.'
              : 'Войдите со своим email и паролем, чтобы получить доступ к своим фильмам.'}
          </p>
        </header>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false)
              setError(null)
              setInfoMessage(null)
            }}
          >
            Вход
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true)
              setError(null)
              setInfoMessage(null)
            }}
          >
            Регистрация
          </button>
        </div>

        <form className="movie-form auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="form-error-banner">
              ⚠️ {error}
            </div>
          )}

          {infoMessage && (
            <div role="status" className="form-info-banner">
              ℹ️ {infoMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">
              Адрес электронной почты (Email) <span className="required-star">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              className="form-input"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">
              Пароль <span className="required-star">*</span>
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="form-input"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting
                ? 'Выполняется запрос…'
                : isRegister
                  ? 'Зарегистрироваться'
                  : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
