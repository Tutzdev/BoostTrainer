package com.treino.api.treino.mapper;

import com.treino.api.treino.domain.Serie;
import com.treino.api.treino.dto.SerieResponse;

public final class SerieMapper {

    private SerieMapper() {}

    public static SerieResponse toResponse(Serie serie) {
        return new SerieResponse(
                serie.getId(),
                serie.getNumero(),
                serie.getRepeticoes(),
                serie.getCarga()
        );
    }
}
