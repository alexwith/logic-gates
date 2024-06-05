package com.github.alexwith.gates.service

import com.github.alexwith.gates.exception.ResourceNotFoundException
import com.github.alexwith.gates.model.User
import com.github.alexwith.gates.repository.UserRepository
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService @Autowired constructor(val userRepository: UserRepository) {

    fun findById(id: Long): User {
        return this.userRepository.findById(id).orElseThrow { ResourceNotFoundException("Not found") }
    }

    fun findByGithubId(githubId: Long): User {
        return this.userRepository.findByGithubId(githubId) ?: throw ResourceNotFoundException("Not found")
    }

    fun create(user: User): User {
        return this.userRepository.save(user)
    }

    fun getFromRequest(request: HttpServletRequest): User {
        return (request.getAttribute("user") as User?) ?: throw ResourceNotFoundException("Not logged in")
    }
}