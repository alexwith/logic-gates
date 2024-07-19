package com.github.alexwith.gates.service

import com.github.alexwith.gates.domain.User
import com.github.alexwith.gates.domain.UserEntity
import com.github.alexwith.gates.exception.ResourceNotFoundException
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.selectAll
import org.springframework.stereotype.Service

@Service
class UserService {

    fun findById(id: Long): User {
        return UserEntity
            .selectAll()
            .where { UserEntity.id eq id }
            .map(User::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("Not found")
    }

    fun findByGithubId(githubId: Long): User {
        return UserEntity
            .selectAll()
            .where { UserEntity.githubId eq githubId }
            .map(User::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("Not found")
    }

    fun create(init: User.() -> Unit): User {
        return User.new(init);
    }

    fun getFromRequest(request: HttpServletRequest): User {
        return (request.getAttribute("user") as User?) ?: throw ResourceNotFoundException("Not logged in")
    }
}