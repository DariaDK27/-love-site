package com.dasha.love_site;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/story")
    public String story() {
        return "story";
    }

    @GetMapping("/letter")
    public String letter() {
        return "letter";
    }

    @GetMapping("/game")
    public String game() {
        return "game";
    }
}
