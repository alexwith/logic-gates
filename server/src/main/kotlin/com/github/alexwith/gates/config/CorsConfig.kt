package com.github.alexwith.gates.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter


@Configuration
class CorsConfig {

    @Value("\${base.uri}")
    lateinit var baseURI: String

    @Bean
    fun corsFilter(): FilterRegistrationBean<*> {
        val source = UrlBasedCorsConfigurationSource()

        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOrigin(baseURI)
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        source.registerCorsConfiguration("/**", config)

        val bean: FilterRegistrationBean<*> = FilterRegistrationBean(CorsFilter(source))
        bean.order = 0

        return bean
    }
}