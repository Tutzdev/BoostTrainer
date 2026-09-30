package com.treino.api.treino.dto;

import java.util.List;

public record ExercicioResponse(
        Long id,
        String nome,
        String observacao,
        List<SerieResponse> series
) {}