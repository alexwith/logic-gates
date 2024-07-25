package com.github.alexwith.gates.middleware

import com.github.alexwith.gates.domain.user.User
import com.github.alexwith.gates.exception.ResourceNotFoundException
import com.github.alexwith.gates.provider.JedisClientProvider
import com.github.alexwith.gates.service.UserService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import redis.clients.jedis.JedisPooled

@Component
class UserMiddleware @Autowired constructor(val userService: UserService) : OncePerRequestFilter() {
    val redisClient: JedisPooled = JedisClientProvider.provide()

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        response.setHeader("Access-Control-Allow-Credentials", "true")

        val cookies: Array<out Cookie>? = request.cookies
        if (cookies == null) {
            filterChain.doFilter(request, response)
            return
        }

        var sessionId: String? = null
        for (cookie in cookies) {
            if (!cookie.name.equals("session")) {
                continue
            }

            sessionId = cookie.value
        }

        if (sessionId == null) {
            filterChain.doFilter(request, response)
            return
        }

        val userId = redisClient[sessionId]
        if (userId == null) {
            filterChain.doFilter(request, response)
            return
        }

        transaction {
            try {
                val user: User = this@UserMiddleware.userService.findById(userId.toLong())
                request.setAttribute("user", user)
                request.setAttribute("sessionId", sessionId)
            } catch (ignore: Exception) {
            }

            filterChain.doFilter(request, response)
        }
    }
}

fun HttpServletRequest.getUser(): User {
    return (this.getAttribute("user") as User?) ?: throw ResourceNotFoundException("Not logged in")
}