package com.treino.api.treino.dto;

public record SerieResponse(
        Long id,
        Integer numero,
        Integer repeticoes,
        Double carga
) {}