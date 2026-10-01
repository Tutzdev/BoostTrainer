package com.treino.api.treino.mapper;

import com.treino.api.treino.domain.Exercicio;
import com.treino.api.treino.dto.ExercicioResponse;
import com.treino.api.treino.dto.SerieResponse;

import java.util.List;

public final class ExercicioMapper {

    private ExercicioMapper() {}

    public static ExercicioResponse toResponse(Exercicio exercicio) {
        List<SerieResponse> series = exercicio.getSeries().stream()
                .map(SerieMapper::toResponse)
                .toList();

        return new ExercicioResponse(
                exercicio.getId(),
                exercicio.getNome(),
                exercicio.getObservacao(),
                series
        );
    }
}
