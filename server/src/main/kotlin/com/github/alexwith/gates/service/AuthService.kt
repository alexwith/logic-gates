package com.github.alexwith.gates.service

import com.github.alexwith.gates.exception.ResourceNotFoundException
import com.github.alexwith.gates.model.User
import com.github.alexwith.gates.provider.HttpClientProvider
import com.github.alexwith.gates.provider.JedisClientProvider
import jakarta.servlet.http.Cookie
import kotlinx.serialization.json.*
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import redis.clients.jedis.JedisPooled
import java.util.*

@Service
class AuthService @Autowired constructor(val userService: UserService) {
    val redisClient: JedisPooled = JedisClientProvider.provide()
    val httpClient: OkHttpClient = HttpClientProvider.provide()

    @Value("\${github.client.id}")
    lateinit var githubClientId: String

    @Value("\${github.client.secret}")
    lateinit var githubClientSecret: String

    fun deleteSession(sessionId: String) {
        this.redisClient.del(sessionId)
    }

    fun tryApplyGithubSession(githubCode: String): Cookie? {
        val accessToken: String = this.getGithubOAuthToken(githubCode) ?: return null
        val githubUser: GithubUserInfo = this.getGithubUserInfo(accessToken) ?: return null

        val user: User = try {
            this.userService.findByGithubId(githubUser.id)
        } catch (e: ResourceNotFoundException) {
            this.userService.create(
                User(
                    githubUser.id,
                    githubUser.username
                )
            )
        }

        val sessionId: String = UUID.randomUUID().toString()
        this.redisClient.set(sessionId, user.id.toString())

        val sessionCookie = Cookie("session", sessionId)
        sessionCookie.path = "/"
        sessionCookie.isHttpOnly = true
        sessionCookie.secure = true
        sessionCookie.maxAge = 24 * 60 * 60 // 24 hours

        return sessionCookie
    }

    private fun getGithubOAuthToken(code: String): String? {
        val requestBody: RequestBody = FormBody.Builder()
            .add("client_id", this.githubClientId)
            .add("client_secret", this.githubClientSecret)
            .add("code", code)
            .build()

        val request: Request = Request.Builder()
            .url("https://github.com/login/oauth/access_token")
            .header("Accept", "application/json")
            .post(requestBody)
            .build()

        this.httpClient.newCall(request).execute().use { response ->
            if (response.code != 200) {
                return null
            }

            val responseJson: JsonObject = Json.parseToJsonElement(response.body!!.string()).jsonObject
            return responseJson["access_token"]!!.jsonPrimitive.content
        }
    }

    private fun getGithubUserInfo(accessToken: String): GithubUserInfo? {
        val request: Request = Request.Builder()
            .url("https://api.github.com/user")
            .header("Authorization", "Bearer $accessToken")
            .build()

        this.httpClient.newCall(request).execute().use { response ->
            if (response.code != 200) {
                return null
            }

            val responseJson: JsonObject = Json.parseToJsonElement(response.body!!.string()).jsonObject
            return GithubUserInfo(
                responseJson["id"]!!.jsonPrimitive.long,
                responseJson["login"]!!.jsonPrimitive.content
            )
        }
    }

    private data class GithubUserInfo(val id: Long, val username: String)
}