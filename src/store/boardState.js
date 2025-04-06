// src/store/boardState.js
import { atom, selector } from 'recoil'

export const postsState = atom({
    key: 'postsState',
    default: []
})

export const currentPostState = atom({
    key: 'currentPostState',
    default: null
})

export const searchState = atom({
    key: 'searchState',
    default: {
        type: 'title',
        keyword: ''
    }
})