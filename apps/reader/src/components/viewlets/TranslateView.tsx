import { useState, useEffect } from 'react'

import { useAction, useTranslation } from '@flow/reader/hooks'
import { useReaderSnapshot, reader } from '@flow/reader/models'

import { PaneViewProps, PaneView } from '../base'
import translate from '../../hooks/remote/translate_api'
import clsx from 'clsx'
import { isTouchScreen, scale } from '../../platform'

function useIntermediateKeyword() {
  const [keyword, setKeyword] = useState('')
  const { focusedBookTab } = useReaderSnapshot()

  useEffect(() => {
    setKeyword(focusedBookTab?.keyword ?? '')
  }, [focusedBookTab?.keyword])

  useEffect(() => {
    reader.focusedBookTab?.setKeyword(keyword)
  }, [keyword])

  return [keyword, setKeyword] as const
}

function useIntermediateTranslate(keyword: string) {
  const [translatedText, setTranslatedText] = useState('')
  useEffect(() => {
    const translateAndSetState = async () => {
      try {
        // Call the translate function and wait for the result
        const result = await translate(keyword)

        // Use type assertion to inform TypeScript about the expected type
        setTranslatedText(result as string)
        /*const response = await axios.post('http://localhost:5000/translate', {
            Text,
          });
    
          // Assuming the API response has a 'translatedText' field
          const translatedResult = response.data.translatedText;
          
          setTranslatedText(translatedResult);*/

        console.log(result)
        //console.log(response)
      } catch (error) {
        // Handle errors if translation fails
        console.error(`Translation error: ${error.message}`) //
      }
    }

    // Call the translation function when the component mounts
    translateAndSetState()
  }, [keyword])
  return [translatedText, setTranslatedText] as const
}

export const TranslateView: React.FC<PaneViewProps> = (props) => {
  const [action] = useAction()
  const { focusedBookTab } = useReaderSnapshot()
  const t = useTranslation()

  const [targetLanguage, setTargetLanguage] = useIntermediateKeyword()
  const [keyword, setKeyword] = useIntermediateKeyword()
  const [translatedText, setTranslatedText] = useIntermediateTranslate(keyword)

  const results = focusedBookTab?.results
  const expanded = results?.some((r) => r.expanded)

  const [isPanelOpen, setPanelOpen] = useState(false)
  const handleButtonClick = () => {
    setPanelOpen(!isPanelOpen)
  }

  const boxStyle = {
    padding: '10%',
    height: '95%',
  }
  const textStyle = {
    padding: 10,
    height: '45%',
    borderLeft: '1px outset #0ea5e9',
    overflow: 'auto', // Enable scrolling
  }

  const titleStyle = {
    margin: 5,
    fontWeight: 'bold',
  }

  const ICON_SIZE = scale(22, 28)

  const floatStyle = {
    border: '1px solid #000',
  }

  return (
    <PaneView {...props}>
      <div style={boxStyle}>
        <h4
          className={clsx('typescale-title-medium  text-on-surface-variant')}
          style={titleStyle}
        >
          Original Text:
        </h4>
        <p
          className={clsx('typescale-body-medium  text-on-surface-variant')}
          style={textStyle}
        >
          {' '}
          {keyword}
        </p>
        <br />

        <h4
          className={clsx('typescale-title-medium  text-on-surface-variant')}
          style={titleStyle}
        >
          Translated Text:
        </h4>

        <p
          className={clsx('typescale-body-medium  text-on-surface-variant')}
          style={textStyle}
        >
          {' '}
          {translatedText}
        </p>
      </div>
    </PaneView>
  )
}

interface TranslateViewProps {
  keyword: string
  translatedText: string
}

export default TranslateView
