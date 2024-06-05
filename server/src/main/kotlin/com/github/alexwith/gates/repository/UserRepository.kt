package com.github.alexwith.gates.repository

import com.github.alexwith.gates.model.User
import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Long> {

    fun findByGithubId(githubId: Long): User?

    fun findByUsername(username: String): User?
}