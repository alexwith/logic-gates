package com.github.alexwith.gates.dto.project

import com.github.alexwith.gates.enums.ProjectVisibility

class CreateProjectDTO(val name: String, val shortDescription: String, val description: String, val visibility: ProjectVisibility)