package com.github.alexwith.gates.model

import jakarta.persistence.*

@Entity
@Table(name = "user_profile") // this is due to user being a reserved keyword
data class User(
    val githubId: Long? = null,
    val username: String? = null,
    @Id @GeneratedValue(strategy = GenerationType.AUTO) val id: Long = -1
)
