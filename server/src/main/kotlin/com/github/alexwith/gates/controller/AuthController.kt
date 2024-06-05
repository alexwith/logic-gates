package com.github.alexwith.gates.controller

import com.github.alexwith.gates.service.AuthService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.view.RedirectView

@RestController
@RequestMapping("/api/v1/auth")
class AuthController @Autowired constructor(val authService: AuthService) {

    @GetMapping("/login/github")
    fun github(response: HttpServletResponse, @RequestParam("code") code: String): RedirectView {
        val sessionCookie: Cookie? = this.authService.tryApplyGithubSession(code)
        if (sessionCookie != null) {
            response.addCookie(sessionCookie)
        }

        return RedirectView("http://localhost:3000")
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): HttpStatus {
        val sessionId: String = request.getAttribute("sessionId") as String? ?: return HttpStatus.BAD_REQUEST
        this.authService.deleteSession(sessionId)

        return HttpStatus.OK
    }
}