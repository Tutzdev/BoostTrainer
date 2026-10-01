package com.treino.api.treino.exception;

public record ErroResponse(
        int status,
        String mensagem
) {}
