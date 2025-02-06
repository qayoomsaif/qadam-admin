import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { uploadImageApi } from '../../utils/services'
import { saveAs } from 'file-saver'

const TextEditor = ({
  onChange = (val: string) => null,
  value,
}: {
  onChange: (val: string) => void
  value: string
}) => {
  const reactQuillRef = useRef(null)
  const getQuillContent = () => {
    const editor = reactQuillRef.current.getEditor() // Access the Quill instance
    const html = editor.root.innerHTML // Get the HTML content
    return html
  }

  const imageHandler = useCallback(() => {
    if (typeof document !== 'undefined') {
      // Create an input element of type 'file'
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/jpeg, image/png')
      input.click()
      input.onchange = async () => {
        const file = input.files[0]
        const validTypes = ['image/jpeg', 'image/png']
        if (!validTypes.includes(file.type)) {
          alert('Only JPEG and PNG images are allowed')
          return
        }
        const maxSize = 10 * 1024 * 1024 // 10 MB
        if (file.size > maxSize) {
          alert('File size should not exceed 10 MB')
          return
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', file?.name)
        const response = await uploadImageApi(formData)

        const imageURL = response.data.data[0]
        const range = reactQuillRef.current.getEditor().getSelection()
        reactQuillRef.current
          .getEditor()
          .insertEmbed(range.index, 'image', imageURL)
      }
    }
  }, [])
  const handleVideo = useCallback(() => {
    if (typeof document !== 'undefined') {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'video/*')
      input.click()
      input.onchange = async () => {
        const file = input.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', file?.name)
        const response = await uploadImageApi(formData)
        const videoUrl = response.data.data[0]
        const range = reactQuillRef.current.getEditor().getSelection()

        let videoEmbed = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`
        // console.log({ videoEmbedvideoEmbed: videoEmbed })
        reactQuillRef.current
          .getEditor()
          .insertEmbed(range.index, 'video', videoUrl)
        // reactQuillRef.current
        //   .getEditor()
        //   .clipboard.dangerouslyPasteHTML(range.index, videoEmbed)
      }
    }
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            // { indent: '-1' },
            // { indent: '+1' },
          ],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
          video: handleVideo,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler, handleVideo]
  )
  return (
    <div className="editor-container">
      <ReactQuill
        ref={reactQuillRef}
        className="min-h-[100px] h-auto max-h-[50vh] overflow-y-auto"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={[
          'header',
          'font',
          'size',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          'image',
          'video',
        ]}
      />
    </div>
  )
}

export default TextEditor
