import { errors } from './errors'

export class ApiClient {
    constructor(url) {
        this.baseUrl = url

        this.buildUrl = this.buildUrl.bind(this)

        this.get = this.get.bind(this)
        this.post = this.post.bind(this)
        this.delete = this.delete.bind(this)

        this.getJson = this.getJson.bind(this)
        this.postJson = this.postJson.bind(this)
        this.deleteJson = this.deleteJson.bind(this)
    }

    buildUrl(path, params) {
        const url = `${this.baseUrl + path}?`
        if (params) {
            return url + $.param(params)
        }
        return url
    }

    get(path, options) {
        return fetch(this.buildUrl(path, options && options.params), {
            ...options,
            method: 'get',
        })
    }

    post(path, body, options) {
        return fetch(this.buildUrl(path, options && options.params), {
            ...options,
            method: 'post',
            body: body,
        })
    }

    delete(path, options) {
        return fetch(this.buildUrl(path, options && options.params), {
            ...options,
            method: 'delete',
        })
    }

    getJson(path, options) {
        return this.get(path, {
            ...options,
            headers: {
                ...(options ? options.headers : {}),
                'Content-Type': 'application/json'
            }
        }).then(data => data.json())
    }

    postJson(path, body, options) {
        return this.post(path, JSON.stringify(body), {
            ...options,
            headers: {
                ...(options ? options.headers : {}),
                'Content-Type': 'application/json'
            }
        }).then(data => data.json())
    }

    deleteJson(path, options) {
        return this.delete(path, {
            ...options,
            headers: {
                ...(options ? options.headers : {}),
                'Content-Type': 'application/json'
            }
        }).then(data => data.json())
    }
}

export class SecureApiClient {
    constructor(url, tokenName, unauthorizedCallback) {
        this.client = new ApiClient(url)
        this.tokenName = tokenName
        this.callback = unauthorizedCallback

        this.getToken = this.getToken.bind(this)
        this.setToken = this.setToken.bind(this)

        let oldGet = this.client.get
        this.client.get = (path, options) => new Promise((resolve, reject) => {
            let token = this.getToken()
            if (token) {
                oldGet(path, {
                    ...options,
                    headers: {
                        ...(options ? options.headers : {}),
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.status !== 401) {
                        // authorized
                        this.setToken(response.headers.get(this.tokenName))
                        resolve(response)
                    } else if (response.status === 401) {
                        // unauthorized
                        this.callback()
                        reject(errors.UNAUTHORIZED_ACCESS)
                    }
                })
            } else {
                // no token found
                this.callback()
                reject(errors.NO_JWT_TOKEN)
            }
        })

        let oldPost = this.client.post
        this.client.post = (path, body, options) => new Promise((resolve, reject) => {
            let token = this.getToken()
            if (token) {
                oldPost(path, body, {
                    ...options,
                    headers: {
                        ...(options ? options.headers : {}),
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.status !== 401) {
                        // authorized
                        this.setToken(response.headers.get(this.tokenName))
                        resolve(response)
                    } else {
                        // unauthorized
                        this.callback()
                        reject(errors.UNAUTHORIZED_ACCESS)
                    }
                })
            } else {
                // no token found
                this.callback()
                reject(errors.NO_JWT_TOKEN)
            }
        })

        let oldDelete = this.client.delete
        this.client.delete = (path, options) => new Promise((resolve, reject) => {
            let token = this.getToken()
            if (token) {
                oldDelete(path, {
                    ...options,
                    headers: {
                        ...(options ? options.headers : {}),
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    if (response.status !== 401) {
                        // authorized
                        this.setToken(response.headers.get(this.tokenName))
                        resolve(response)
                    } else {
                        // unauthorized
                        this.callback()
                        reject(errors.UNAUTHORIZED_ACCESS)
                    }
                })
            } else {
                // no token found
                this.callback()
                reject(errors.NO_JWT_TOKEN)
            }
        })
    }

    getToken() {
        let token = localStorage.getItem(this.tokenName)
        return token
    }

    setToken(token) {
        localStorage.setItem(this.tokenName, token)
    }
}