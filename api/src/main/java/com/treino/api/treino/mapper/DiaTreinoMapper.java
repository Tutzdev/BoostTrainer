package com.treino.api.treino.mapper;

import com.treino.api.treino.domain.DiaTreino;
import com.treino.api.treino.dto.DiaTreinoResponse;
import com.treino.api.treino.dto.ExercicioResponse;

import java.util.List;

public final class DiaTreinoMapper {

    private DiaTreinoMapper() {}

    public static DiaTreinoResponse toResponse(DiaTreino diaTreino) {
        List<ExercicioResponse> exercicios = diaTreino.getExercicios().stream()
                .map(ExercicioMapper::toResponse)
                .toList();

        return new DiaTreinoResponse(
                diaTreino.getId(),
                diaTreino.getDia(),
                diaTreino.getNome(),
                exercicios
        );
    }
}
