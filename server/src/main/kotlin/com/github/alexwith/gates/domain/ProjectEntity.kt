package com.github.alexwith.gates.domain

import com.github.alexwith.gates.enums.ProjectVisibility
import org.jetbrains.exposed.dao.id.LongIdTable

object ProjectEntity : LongIdTable("project") {
    val name = varchar("name", 255)
    val shortDescription = varchar("simpleDescription", 255)
    val description = text("description")
    val visibility = enumeration<ProjectVisibility>("visibility")
    val data = binary("data")
    val creator = reference("creator", UserEntity)
}