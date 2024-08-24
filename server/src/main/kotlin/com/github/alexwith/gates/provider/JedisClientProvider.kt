package com.github.alexwith.gates.provider

import redis.clients.jedis.JedisPooled

class JedisClientProvider private constructor() {

    companion object {
        private var jedisInstance: JedisPooled? = null

        fun provide(): JedisPooled {
            synchronized(this) {
                return jedisInstance ?: JedisPooled("alexwith.com", 6379).also { jedisInstance = it }
            }
        }
    }
}