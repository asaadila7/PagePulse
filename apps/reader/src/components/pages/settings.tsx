import { useEventListener } from '@literal-ui/hooks'
import Dexie from 'dexie'
import { support } from 'jszip'
import { useRouter } from 'next/router'
import { parseCookies, destroyCookie } from 'nookies'
import { useState } from 'react' // Import useState hook

import {
  ColorScheme,
  useColorScheme,
  useForceRender,
  useTranslation,
} from '@flow/reader/hooks'
import { dbx, mapToToken, OAUTH_SUCCESS_MESSAGE } from '@flow/reader/sync'

import { Button } from '../Button'
import { Select } from '../Form'
import { Page } from '../Page'

// const supported_languages = [
//   ['Arabic', 'ar'],
//   ['Azerbaijani', 'az'],
//   ['Catalan', 'ca'],
//   ['Chinese', 'zh'],
//   ['Czech', 'cs'],
//   ['Danish', 'da'],
//   ['Dutch', 'nl'],
//   ['English', 'en'],
//   ['Esperanto', 'eo'],
//   ['Finnish', 'fi'],
//   ['French', 'fr'],
//   ['German', 'de'],
//   ['Greek', 'el'],
//   ['Hebrew', 'he'],
//   ['Hindi', 'hi'],
//   ['Hungarian', 'hu'],
//   ['Indonesian', 'id'],
//   ['Irish', 'ga'],
//   ['Italian', 'it'],
//   ['Japanese', 'ja'],
//   ['Korean', 'ko'],
//   ['Persian', 'fa'],
//   ['Polish', 'pl'],
//   ['Portuguese', 'pt'],
//   ['Russian', 'ru'],
//   ['Slovak', 'sk'],
//   ['Spanish', 'es'],
//   ['Swedish', 'sv'],
//   ['Turkish', 'tr'],
//   ['Ukrainian', 'uk'],
// ]

// let currentLanguage = 'en'
const currentLanguage = 'en'

const Settings: React.FC = () => {
  const { scheme, setScheme } = useColorScheme()
  const { asPath, push, locale } = useRouter()
  const t = useTranslation('settings')
  // const [curLang, setCurLang] = useState('en')

  return (
    <Page headline={t('title')}>
      <div className="space-y-6">
        <Item title={t('lanuage')}>
          <Select
            value={locale}
            onChange={(e) => {
              push(asPath, undefined, { locale: e.target.value })
            }}
          >
            <option value="en-US">English</option>
            <option value="zh-CN">简体中文</option>
          </Select>
        </Item>
        <Item title={t('color_scheme')}>
          <Select
            value={scheme}
            onChange={(e) => {
              setScheme(e.target.value as ColorScheme)
            }}
          >
            <option value="system">{t('color_scheme.system')}</option>
            <option value="light">{t('color_scheme.light')}</option>
            <option value="dark">{t('color_scheme.dark')}</option>
          </Select>
        </Item>
        <Synchronization />
        <Item title={t('cache')}>
          <Button
            variant="secondary"
            onClick={() => {
              window.localStorage.clear()
              Dexie.getDatabaseNames().then((names) => {
                names.forEach((n) => Dexie.delete(n))
              })
            }}
          >
            {t('cache.clear')}
          </Button>
        </Item>
        {/* <Item title={t('text_language')}>
          <Select
            value={curLang}
            onChange={(e) => {
              const lang_code = supported_languages.find(
                (lang) => lang[0] === e.target.value,
              )
              if (!lang_code) {
                throw new Error('Was not able to get a matching language')
              }
              const code = lang_code?.[1] // Access [1] after checking lang_code
              if (!code) {
                throw new Error('Language code is undefined')
              }
              setCurLang(code)
              currentLanguage = code
            }}
          >
            {supported_languages.map((lang) => (
              <option value={lang[1]}>{lang[0]}</option>
            ))}
          </Select>
        </Item> */}
      </div>
    </Page>
  )
}

const Synchronization: React.FC = () => {
  const cookies = parseCookies()
  const refreshToken = cookies[mapToToken['dropbox']]
  const render = useForceRender()
  const t = useTranslation('settings.synchronization')

  useEventListener('message', (e) => {
    if (e.data === OAUTH_SUCCESS_MESSAGE) {
      // init app (generate access token, fetch remote data, etc.)
      window.location.reload()
    }
  })

  return (
    <Item title={t('title')}>
      <Select>
        <option value="dropbox">Dropbox</option>
      </Select>
      <div className="mt-2">
        {refreshToken ? (
          <Button
            variant="secondary"
            onClick={() => {
              destroyCookie(null, mapToToken['dropbox'])
              render()
            }}
          >
            {t('unauthorize')}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const redirectUri =
                window.location.origin + '/api/callback/dropbox'

              dbx.auth
                .getAuthenticationUrl(
                  redirectUri,
                  JSON.stringify({ redirectUri }),
                  'code',
                  'offline',
                )
                .then((url) => {
                  window.open(url as string, '_blank')
                })
            }}
          >
            {t('authorize')}
          </Button>
        )}
      </div>
    </Item>
  )
}

interface PartProps {
  title: string
}
const Item: React.FC<PartProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="typescale-title-small text-on-surface-variant">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}

Settings.displayName = 'settings'

export { Settings, currentLanguage }
