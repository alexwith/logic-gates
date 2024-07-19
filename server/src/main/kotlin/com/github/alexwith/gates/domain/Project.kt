package com.github.alexwith.gates.domain

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class Project(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Project>(ProjectEntity)

    var name by ProjectEntity.name
    var simpleDescription by ProjectEntity.simpleDescription
    var description by ProjectEntity.description
    var data by ProjectEntity.data
    val creator by User referencedOn ProjectEntity.creator
}