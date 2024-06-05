package com.github.alexwith.gates.provider

import okhttp3.OkHttpClient

class HttpClientProvider private constructor() {

    companion object {
        private var okHttpInstance: OkHttpClient? = null

        fun provide(): OkHttpClient {
            synchronized(this) {
                return okHttpInstance ?: OkHttpClient().also { okHttpInstance = it }
            }
        }
    }
}