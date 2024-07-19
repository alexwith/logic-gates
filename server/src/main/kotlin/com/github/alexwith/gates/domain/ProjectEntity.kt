package com.github.alexwith.gates.domain

import org.jetbrains.exposed.dao.id.LongIdTable

object ProjectEntity : LongIdTable("project") {
    val name = varchar("name", 255)
    val simpleDescription = varchar("simpleDescription", 255)
    val description = text("description")
    val data = binary("data")
    val creator = reference("creator", UserEntity)
}