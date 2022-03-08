import { useState, useRef } from 'react'
const useInput = (valdateValue) => {
    const [enteredValue, setEnteredValue] = useState('')
    const [isTouched, setIsTouched] = useState(false)

    const reference = useRef()
    const valueIsValid = valdateValue(enteredValue)
    const hasError = !valueIsValid && isTouched

    const valueChangeHandler = (event) => {
        setEnteredValue(event.target.value)
    }
    const inputBlurHandler = (event) => {
        setIsTouched(true)
    }
    const validclass = hasError ? 'isinvalid item' : 'valid item'
    return {
        validclass,
        hasError,
        reference,
        valueIsValid,
        valueChangeHandler,
        inputBlurHandler
    }
}
export default useInput