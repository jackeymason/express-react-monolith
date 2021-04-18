import React, { useState, useEffect } from "react"
import { hot } from "react-hot-loader/root"

import "../assets/scss/main.scss"

import BookForm from './BookForm'
import ErrorList from "./ErrorList"

const App = (props) => {
  const [books, setBooks] = useState([])
  const [errors, setErrors] = useState({})

  const addBook = async (formPayload) => {
    try {
      const response = await fetch('/api/v1/books', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(formPayload)
      })
      if (!response.ok) {
        if(response.status === 422) {
          const body = await response.json()
          return setErrors(body.errors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw(error)
        }
      }
      const body = await response.json()
      const currentBooks = books
      setErrors({})
      setBooks(currentBooks.concat(body.book))
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/v1/books')
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const bookData = await response.json()
      setBooks(bookData.books)
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchData()
  },[])

  const bookListItems = books.map(book => {
    return <li key={book.id}>{book.title}</li>;
  })

  return (
    <div>
      <h1>Books</h1>
      <ul>
        {bookListItems}
      </ul>
      <hr />
      <ErrorList errors={errors} />
      <BookForm addBook={addBook} />
    </div>
  )
}

export default hot(App)
