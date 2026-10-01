package com.treino.api.treino.exception;

import java.util.Map;

public record ValidacaoErroResponse(
        int status,
        String mensagem,
        Map<String, String> campos
) {}
