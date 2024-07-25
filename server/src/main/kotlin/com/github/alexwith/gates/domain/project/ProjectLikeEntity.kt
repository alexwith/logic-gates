package com.github.alexwith.gates.domain.project

import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.domain.user.UserEntity
import org.jetbrains.exposed.sql.Table

object ProjectLikeEntity : Table("project_like") {
    val user = reference("user", UserEntity)
    val project = reference("project", ProjectEntity)
}