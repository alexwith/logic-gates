package com.github.alexwith.gates

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GatesApplication

fun main(args: Array<String>) {
    runApplication<GatesApplication>(*args)
}
