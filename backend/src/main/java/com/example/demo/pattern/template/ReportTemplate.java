package com.example.demo.pattern.template;

import java.util.Map;

public abstract class ReportTemplate {

    // The Template Method
    public final Map<String, Object> generateReport() {
        fetchData();
        return processData();
    }

    protected abstract void fetchData();
    protected abstract Map<String, Object> processData();
}
