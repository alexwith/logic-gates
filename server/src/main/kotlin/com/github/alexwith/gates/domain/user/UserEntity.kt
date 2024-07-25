package com.github.alexwith.gates.domain.user

import org.jetbrains.exposed.dao.id.LongIdTable

// user is a reserved keyword in postgres, therefore we name it user_profile
object UserEntity : LongIdTable("user_profile") {
    val githubId = long("githubId")
    val username = varchar("username", 100)
}